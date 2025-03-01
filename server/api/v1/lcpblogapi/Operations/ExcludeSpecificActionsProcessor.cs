

using lcpblogapi.Attributes;
using NSwag.Generation.Processors;
using NSwag.Generation.Processors.Contexts;

namespace lcpblogapi.Operations;

public class ExcludeSpecificActionsProcessor : IOperationProcessor
{
    public bool Process(OperationProcessorContext context)
    {
        var actionAttributes = context.MethodInfo.GetCustomAttributes(true);

        if (actionAttributes.Any(attr => attr is IgnoreAPIAttribute))
        {
            return false;
        }

        return true;
    }
}
